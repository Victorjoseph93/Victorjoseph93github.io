module.exports.authenticateUser = (req, res, next) => {
    if (!req.user) {
        return res.status(401).json({ msg: "Unauthorized" });
    }
    next();
};

