export const requireAuth = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ error: 'Authentication required' });
  }
  return next();
};

export const requireTeacher = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ error: 'Authentication required' });
  }

  if (req.user.role !== 'teacher') {
    return res.status(403).json({
      error: `Access denied. Teachers only. Your role: ${req.user.role}`,
    });
  }

  return next();
};

export const requireOwnership = (getOwnerId) => {
  return async (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    try {
      const ownerId = await getOwnerId(req);
      if (ownerId !== req.user.id) {
        return res.status(403).json({ error: 'Access denied' });
      }
      return next();
    } catch (error) {
      console.error('Ownership check failed:', error);
      return res.status(500).json({ error: 'Server error' });
    }
  };
};

export const requireTeacherOwnership = (getOwnerId) => {
  return async (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    // Only teachers can access, and only their own resources
    if (req.user.role !== 'teacher') {
      return res.status(403).json({ error: 'Access denied. Students cannot perform this action.' });
    }

    try {
      const ownerId = await getOwnerId(req);
      if (ownerId !== req.user.id) {
        return res.status(403).json({ error: 'Access denied. You can only manage your own courses.' });
      }
      return next();
    } catch (error) {
      console.error('Ownership check failed:', error);
      return res.status(500).json({ error: 'Server error' });
    }
  };
};
