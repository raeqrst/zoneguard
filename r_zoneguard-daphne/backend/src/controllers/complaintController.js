const prisma = require('../config/prisma');

const avatarColors = [
	'#8a6d3b',
	'#f0ad4e',
	'#778899',
	'#d9534f',
	'#555555',
	'#ea580c',
	'#d9534f',
	'#a3e4d7'
];

const getAvatarColor = (seed) => {
	const normalizedSeed = seed || 'complaint';
	let hash = 0;

	for (let index = 0; index < normalizedSeed.length; index += 1) {
		hash = (hash * 31 + normalizedSeed.charCodeAt(index)) % avatarColors.length;
	}

	return avatarColors[Math.abs(hash) % avatarColors.length];
};

const formatCategory = (category) => {
	if (!category) return 'UNKNOWN';
	return category.replace(/_/g, ' ');
};

const getCategoryTone = (category) => {
	const normalized = (category || '').toUpperCase();

	if (normalized.includes('FINANCIAL')) return 'financial';
	if (normalized.includes('INFRASTRUCTURE')) return 'infrastructure';
	if (normalized.includes('BEAUTIFICATION')) return 'beautification';
	if (normalized.includes('PUBLIC')) return 'pr';
	if (normalized.includes('GRIEV')) return 'grievance';
	if (normalized.includes('SPORT')) return 'sport';

	return 'financial';
};

const getStatusTone = (status) => {
	const normalized = (status || '').toUpperCase();

	if (normalized === 'ESCALATED') return 'escalated';
	if (normalized === 'INVESTIGATING' || normalized === 'IN_PROGRESS') return 'investigating';
	if (normalized === 'RESOLVED') return 'resolved';
	if (normalized === 'ACTIVE' || normalized === 'PENDING') return 'active';

	return 'investigating';
};

const getPriorityScore = (status) => {
	const normalized = (status || '').toUpperCase();

	if (normalized === 'ESCALATED') return '10';
	if (normalized === 'ACTIVE') return '8';
	if (normalized === 'INVESTIGATING' || normalized === 'IN_PROGRESS') return '5';
	if (normalized === 'RESOLVED') return '2';

	return '5';
};

const getPriorityTone = (score) => {
	const value = Number(score);

	if (Number.isNaN(value)) return 'yellow';
	if (value >= 8) return 'red';
	if (value >= 5) return 'yellow';

	return 'green';
};

const resolveResidentContext = async (user) => {
	const homeownerRecord = user.homeowners?.[0] || null;
	const tenantRecord = user.tenants?.[0] || null;

	let lotRecord = tenantRecord?.lot || null;

	if (!lotRecord && homeownerRecord) {
		lotRecord = await prisma.lot.findFirst({
			where: { homeownerId: homeownerRecord.id }
		});
	}

	const initials = `${user.firstName?.[0] || 'U'}${user.lastName?.[0] || 'N'}`.toUpperCase();

	return {
		init: initials,
		bgColor: getAvatarColor(user.id),
		name: [user.firstName, user.middleName, user.lastName].filter(Boolean).join(' '),
		address: lotRecord
			? `Zone ${user.zone?.name?.replace(/^Zone\s*/i, '') || 'N/A'}, ${lotRecord.blockNumber ?? 'N/A'} ${lotRecord.street || ''}`.trim()
			: user.zone?.name || 'No Zone Assigned'
	};
};

exports.getAllComplaints = async (req, res) => {
	try {
		const { zone, status, category, search } = req.query;

		const complaints = await prisma.complaint.findMany({
			orderBy: { createdAt: 'desc' },
			include: {
				user: {
					include: {
						zone: true,
						homeowners: true,
						tenants: {
							include: {
								lot: true
							}
						}
					}
				}
			}
		});

		const filtered = complaints.filter((complaint) => {
			const residentName = [complaint.user?.firstName, complaint.user?.middleName, complaint.user?.lastName]
				.filter(Boolean)
				.join(' ')
				.toLowerCase();
			const complaintText = [complaint.complaintSubject, complaint.complaintDesc, complaint.id]
				.filter(Boolean)
				.join(' ')
				.toLowerCase();
			const complaintCategory = (complaint.complaintCategory || '').toLowerCase();
			const complaintStatus = (complaint.status || '').toLowerCase();
			const residentZone = (complaint.user?.zone?.name || '').toLowerCase();

			if (zone && !residentZone.includes(zone.toLowerCase())) return false;
			if (status && complaintStatus !== status.toLowerCase()) return false;
			if (category && complaintCategory !== category.toLowerCase()) return false;
			if (search) {
				const normalizedSearch = search.toLowerCase();
				const matchesSearch = residentName.includes(normalizedSearch)
					|| complaintText.includes(normalizedSearch)
					|| complaintCategory.includes(normalizedSearch)
					|| complaintStatus.includes(normalizedSearch);

				if (!matchesSearch) return false;
			}

			return true;
		});

		const mappedComplaints = await Promise.all(filtered.map(async (complaint) => {
			const resident = complaint.user
				? await resolveResidentContext(complaint.user)
				: {
						init: 'CB',
						bgColor: getAvatarColor(complaint.id),
						name: 'Unknown Resident',
						address: 'No address available'
					};

			const priorityScore = getPriorityScore(complaint.status);

			return {
				id: complaint.id,
				ticket: complaint.id,
				categoryRaw: complaint.complaintCategory,
				init: resident.init,
				bgColor: resident.bgColor,
				name: resident.name,
				address: resident.address,
				category: formatCategory(complaint.complaintCategory),
				catTone: getCategoryTone(complaint.complaintCategory),
				status: complaint.status ? complaint.status.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, (letter) => letter.toUpperCase()) : 'Unknown',
				statusTone: getStatusTone(complaint.status),
				priority: priorityScore,
				prioTone: getPriorityTone(priorityScore),
				subject: complaint.complaintSubject,
				description: complaint.complaintDesc,
				evidenceImg: complaint.evidenceImg,
				residentType: complaint.user?.systemRole || null,
				zone: complaint.user?.zone?.name || null,
				createdAt: complaint.createdAt,
				assignedDirectorId: complaint.assignedDirectorId,
				escalationRemarks: complaint.escalatedRemarks
			};
		}));

		res.status(200).json({
			success: true,
			complaints: mappedComplaints
		});
	} catch (error) {
		console.error('DETAILED COMPLAINT ERROR:', error);
		res.status(500).json({ error: error.message });
	}
};

exports.createComplaint = async (req, res) => {
	try {
		const {
			complaint_category,
			complaint_subject,
			complaint_desc,
			evidence_img,
			complaint_status,
			assigned_director_id,
			escalation_remarks,
			user_id
		} = req.body;

		if (!complaint_category || !complaint_subject || !complaint_desc) {
			return res.status(400).json({ error: 'Please provide complaint category, subject, and description.' });
		}

		const complaint = await prisma.complaint.create({
			data: {
				complaintCategory: complaint_category,
				complaintSubject: complaint_subject,
				complaintDesc: complaint_desc,
				evidenceImg: evidence_img || null,
				status: complaint_status || 'ACTIVE',
				assignedDirectorId: assigned_director_id || null,
				escalatedRemarks: escalation_remarks || null,
				userId: user_id || null
			}
		});

		res.status(201).json({ success: true, complaint });
	} catch (error) {
		console.error('Error creating complaint:', error);
		res.status(500).json({ error: error.message });
	}
};

exports.updateComplaintStatus = async (req, res) => {
	try {
		const { id } = req.params;
		const {
			status,
			description,
			escalation_reason,
			assigned_director_id
		} = req.body;

		if (!status) {
			return res.status(400).json({ error: 'Status is required.' });
		}

		const normalizedStatus = status.toString().trim().toUpperCase();
		const validStatuses = ['ACTIVE', 'INVESTIGATING', 'ESCALATED', 'RESOLVED', 'PENDING', 'IN_PROGRESS', 'DISMISSED'];

		if (!validStatuses.includes(normalizedStatus)) {
			return res.status(400).json({ error: 'Invalid complaint status.' });
		}

		const complaint = await prisma.complaint.update({
			where: { id },
			data: {
				status: normalizedStatus,
				escalatedRemarks: description || escalation_reason || null,
				assignedDirectorId: assigned_director_id || null
			}
		});

		res.status(200).json({
			success: true,
			complaint: {
				id: complaint.id,
				status: complaint.status,
				escalatedRemarks: complaint.escalatedRemarks,
				assignedDirectorId: complaint.assignedDirectorId,
				updatedAt: complaint.updatedAt
			}
		});
	} catch (error) {
		console.error('Error updating complaint status:', error);
		res.status(500).json({ error: error.message });
	}
};