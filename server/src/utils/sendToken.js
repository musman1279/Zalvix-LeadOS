const sendToken = (user, statusCode, res, message) => {
    // Generate JWT Token
    const token = user.getJwtToken();

    // Cookie Options
    const options = {
        expires: new Date(
            Date.now() +
                Number(process.env.COOKIE_EXPIRE) * 24 * 60 * 60 * 1000
        ),
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
    };

    // Send Cookie & Response
   return  res
        .status(statusCode)
        .cookie("token", token, options)
        .json({
            success: true,
            message,
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
            },
        });
};

export default sendToken;