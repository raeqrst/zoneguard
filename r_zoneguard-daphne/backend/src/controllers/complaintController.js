const prisma = require('../config/db');

let addressMap = new Map();

const formatResidentAddress = (rawZoneName, lot) => {
  const cleanZoneNum = (rawZoneName || 'Zone 3').replace(/zone/gi, "").replace(/nia village.*/gi, "").replace(/nia subdivision.*/gi, "").trim();
  const zoneDisplay = cleanZoneNum ? `Zone ${cleanZoneNum}` : 'Zone 3';

  const houseNo = lot?.houseNo || lot?.house_no || lot?.houseNumber || '';
  const blockNum = lot?.blockNumber || lot?.block_number || lot?.block || '';
  const lotNum = lot?.lotNumber || lot?.lot_number || lot?.lot || '';
  let streetName = lot?.street || '';

  if (streetName && streetName.toLowerCase() !== 'nan') {
    streetName = streetName.replace(/^["']|["']$/g, '').trim();
    if (streetName && !streetName.toLowerCase().match(/(street|st\.?|lane|ln\.?|drive|dr\.?|avenue|ave\.?|road|rd\.?|tria)$/)) {
      streetName = `${streetName} Street`;
    }
  } else {
    streetName = '';
  }

  let locationDetail = '';
  const cleanHouse = houseNo && houseNo.toLowerCase() !== 'nan' ? houseNo.replace(/^["']|["']$/g, '').trim() : '';
  const cleanBlock = blockNum && blockNum.toLowerCase() !== 'nan' ? blockNum.replace('.0', '').trim() : '';
  const cleanLot = lotNum && lotNum.toLowerCase() !== 'nan' ? lotNum.replace('.0', '').trim() : '';

  if (cleanHouse) {
    locationDetail = cleanHouse;
  } else if (cleanBlock || cleanLot) {
    const b = cleanBlock ? `Blk ${cleanBlock}` : '';
    const l = cleanLot ? `Lot ${cleanLot}` : '';
    locationDetail = [b, l].filter(Boolean).join(' ');
  }

  const addressParts = [locationDetail, streetName].filter(item => item && item.toLowerCase() !== 'nan');
  const combinedStreet = addressParts.join(', ');

  return combinedStreet 
    ? `${zoneDisplay}, NIA Subdivision, ${combinedStreet}` 
    : `${zoneDisplay}, NIA Subdivision`;
};

function loadAddresses() {
  try {
    const possibleDirs = [
      path.join(__dirname, '..'),
      path.join(__dirname),
      process.cwd()
    ];

    let usersPath, homePath, lotPath;
    for (const dir of possibleDirs) {
      const uPath = path.join(dir, 'user.csv');
      const hPath = path.join(dir, 'homeowner.csv');
      const lPath = path.join(dir, 'lot.csv');
      if (fs.existsSync(uPath) && fs.existsSync(hPath) && fs.existsSync(lPath)) {
        usersPath = uPath;
        homePath = hPath;
        lotPath = lPath;
        break;
      }
    }

    if (usersPath && homePath && lotPath) {
      const usersLines = fs.readFileSync(usersPath, 'utf8').split(/\r?\n/);
      const homeLines = fs.readFileSync(homePath, 'utf8').split(/\r?\n/);
      const lotLines = fs.readFileSync(lotPath, 'utf8').split(/\r?\n/);

      const userToName = {};
      usersLines.slice(1).forEach(line => {
        const parts = line.split(',');
        if (parts.length >= 4) {
          userToName[parts[0].trim()] = `${parts[2]} ${parts[3]}`.trim().toLowerCase();
        }
      });

      const ownerToUser = {};
      homeLines.slice(1).forEach(line => {
        const parts = line.split(',');
        if (parts.length >= 2) {
          ownerToUser[parts[0].trim()] = parts[1].trim();
        }
      });

      lotLines.slice(1).forEach(line => {
        const parts = line.split(',');
        if (parts.length >= 7) {
          const ownerId = parts[1]?.trim();
          const userId = ownerToUser[ownerId];
          
          if (userId && userToName[userId]) {
            const nameKey = userToName[userId];
            const lotObj = {
              houseNo: parts[3]?.replace(/^["']|["']$/g, '').trim(),
              blockNumber: parts[4]?.replace(/^["']|["']$/g, '').trim(),
              lotNumber: parts[5]?.replace(/^["']|["']$/g, '').trim(),
              street: parts[6]?.replace(/^["']|["']$/g, '').trim()
            };
            
            const tableAddress = formatResidentAddress('Zone 3', lotObj);
            addressMap.set(nameKey, tableAddress);
          }
        }
      });
    }
  } catch (e) {
    console.error("Address mapping error:", e.message);
  }
}

loadAddresses();

exports.getComplaints = async (req, res) => {
  try {
    const { category, zone, search } = req.query;
    
    let query = `
      SELECT 
        c.ticket_id as ticket,
        COALESCE(u.name, 'Resident ' || c.user_id) as name,
        c.complaint_category as category,
        c.complaint_status as status,
        COALESCE(c.complaint_subject, 'General Report') as subject,
        SUBSTRING(COALESCE(u.name, 'US'), 1, 2) as init
      FROM complaints c
      LEFT JOIN users u ON c.user_id = u.id
      WHERE 1=1
    `;
    let params = [];
    
    if (category && category !== 'All Complaints') {
      params.push(category.toUpperCase().replace(' ', '_'));
      query += ` AND UPPER(c.complaint_category) = $${params.length}`;
    }
    
    if (zone) {
      params.push(`%${zone}%`);
      query += ` AND UPPER(COALESCE(u.address, '')) LIKE $${params.length}`;
    }

    if (search) {
      params.push(`%${search}%`);
      query += ` AND (UPPER(COALESCE(u.name, '')) LIKE $${params.length} OR UPPER(c.ticket_id) LIKE $${params.length} OR UPPER(c.complaint_subject) LIKE $${params.length})`;
    }

    query += ` ORDER BY c.created_at DESC`;
    
    const { rows } = await pool.query(query, params);
    
    const formattedRows = rows.map(row => {
      const catUpper = (row.category || '').toUpperCase();
      const statUpper = (row.status || '').toUpperCase();
      
      let catTone = 'default';
      if (catUpper.includes('INFRA')) catTone = 'infrastructure';
      else if (catUpper.includes('PUBLIC')) catTone = 'pr';
      else if (catUpper.includes('GRIEVANCE')) catTone = 'grievance';
      else if (catUpper.includes('FINANCIAL')) catTone = 'financial';
      else if (catUpper.includes('BEAUTIFICATION')) catTone = 'beautification';
      else if (catUpper.includes('SPORT')) catTone = 'sport';

      let statusTone = 'active';
      if (statUpper === 'RESOLVED') statusTone = 'resolved';
      else if (statUpper === 'ESCALATED') statusTone = 'escalated';
      else if (statUpper === 'INVESTIGATING') statusTone = 'investigating';

      const nameKey = (row.name || '').trim().toLowerCase();
      const exactAddress = addressMap.get(nameKey) || 'Zone 3, NIA Subdivision';

      return {
        ...row,
        address: exactAddress,
        catTone,
        statusTone,
        priority: '5',
        prioTone: 'yellow',
        bgColor: '#778899'
      };
    });

    res.json(formattedRows);
  } catch (err) {
    console.error('DB fetch complaints error:', err);
    res.status(500).json({ error: 'Server error fetching complaints' });
  }
};

