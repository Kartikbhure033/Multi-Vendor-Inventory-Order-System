
module.exports.requireRole = (...roles) => (req, res, next) => {
  try {
    
    if (!req.user?.role) {
      return res.status(401).json({ msg: "Not authorized" });
    }
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ msg: "Forbidden: insufficient role" });
    }
    next();
  } catch (e) {
    next(e);
  }
};
