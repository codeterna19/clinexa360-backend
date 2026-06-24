export const tenantMiddleware = (req, res, next) => {
  if (req.user) {
    if (req.user.role === 'SuperAdmin') {
      // Super admins don't have a specific clinic_id inherently, 
      // but they might specify it in query params for viewing specific clinics
      req.tenantFilter = req.query.clinic_id ? { clinic_id: req.query.clinic_id } : {};
    } else {
      // For all other roles, lock them to their own clinic
      req.tenantFilter = { clinic_id: req.user.clinic_id };
    }
  } else {
    req.tenantFilter = {};
  }
  next();
};
