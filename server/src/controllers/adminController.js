export const adminDashboard = (req, res) => {
    res.status(200).json({
        success: true,
        message: "Welcome to Admin Dashboard",
        user: req.user,
    });
};