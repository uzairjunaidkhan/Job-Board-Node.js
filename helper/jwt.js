const expressjwt = require("express-jwt");
const jwt = require("jsonwebtoken");

function authJwt() {
  const secret = process.env.key;

      const allowedPaths = {
      admin: [
        { url: /\/api\/user\/list/, methods: ["GET"] },
        { url: /\/api\/user\/single(.*)/, methods: ["GET"] },
        { url: /\/api\/user\/update(.*)/, methods: ["PUT"] },
        { url: /\/api\/user\/delete(.*)/, methods: ["DELETE"] },
        //   { url: /\/api\/users\/reset-password/, methods: ['POST'] },
        //   { url: /\/api\/users\/reset-password\/:token/, methods: ['POST'] },
        { url: /\/api\/job\/create/, methods: ["POST"] },
        { url: /\/api\/job\/list/, methods: ["GET"] }, //will not work for admin
        { url: /\/api\/job\/single(.*)/, methods: ["GET"] },
        { url: /\/api\/job\/update(.*)/, methods: ["PUT"] },
        { url: /\/api\/job\/delete(.*)/, methods: ["DELETE"] },
        
        { url: /\/api\/application\/list/, methods: ["GET"] }, //will not work for admin
        { url: /\/api\/application\/single(.*)/, methods: ["GET"] },
        { url: /\/api\/application\/update(.*)/, methods: ["PUT"] },
        { url: /\/api\/application\/delete(.*)/, methods: ["DELETE"] },
      ],
      employer: [
        { url: /\/api\/user\/update(.*)/, methods: ["PUT"] },
        { url: /\/api\/user\/delete(.*)/, methods: ["DELETE"] },
        // { url: /\/api\/user\/profile/, methods: ["GET"] },
        // { url: /\/api\/user\/update-profile/, methods: ["PUT"] },
        // { url: /\/api\/users\/reset-password/, methods: ['POST'] },
        // { url: /\/api\/users\/reset-password\/:token/, methods: ['POST'] },
        { url: /\/api\/job\/create/, methods: ["POST"] },
        { url: /\/api\/job\/list/, methods: ["GET"] },
        { url: /\/api\/job\/my\/list/, methods: ["GET"] },
        { url: /\/api\/job\/single(.*)/, methods: ["GET"] },
        { url: /\/api\/job\/update(.*)/, methods: ["PUT"] },
        { url: /\/api\/job\/delete(.*)/, methods: ["DELETE"] },

        { url: /\/api\/application\/list/, methods: ["GET"] },
        { url: /\/api\/application\/single(.*)/, methods: ["GET"] },
        { url: /\/api\/application\/update(.*)/, methods: ["PUT"] },
        // { url: /\/api\/application\/delete(.*)/, methods: ["DELETE"] },
      ],
      jobSeeker: [
        { url: /\/api\/user\/update(.*)/, methods: ["PUT"] },
        { url: /\/api\/user\/delete(.*)/, methods: ["DELETE"] },
        // { url: /\/api\/users\/profile/, methods: ["GET"] },
        // { url: /\/api\/users\/update-profile/, methods: ["PUT"] },
        // { url: /\/api\/users\/reset-password/, methods: ['POST'] },
        // { url: /\/api\/users\/reset-password\/:token/, methods: ['POST'] },
        { url: /\/api\/job\/list/, methods: ["GET"] },
        { url: /\/api\/job\/single(.*)/, methods: ["GET"] },

        { url: /\/api\/application\/my\/list/, methods: ["GET"] },
        { url: /\/api\/application\/single(.*)/, methods: ["GET"] },
        { url: /\/api\/application\/create(.*)/, methods: ["POST"] },
        // { url: /\/api\/application\/update(.*)/, methods: ["PUT"] },
        { url: /\/api\/application\/delete(.*)/, methods: ["DELETE"] },
      ],
    };

  return (req, res, next) => {
    // Extract the token from the request headers
    const token = req.headers.authorization;

    if (
      (req.url === "/api/user/login" && req.method === "POST") ||
      (req.url === "/api/user/register" && req.method === "POST")
    ) {
      return next();
    }

    if (!token) {
      // Token is missing, return Unauthorized
      return res.status(401).json({ message: "Token is missing, Unauthorized" });
    }

    // Verify and decode the token
    jwt.verify(token.replace("Bearer ", ""), secret, (err, decoded) => {
      if (err) {
        // Token is invalid, return Unauthorized
        return res.status(401).json({ message: "Token is invalid, Unauthorized" });
      }

      // Extract the user's role from the decoded token
      const userRole = decoded.role;
      req.user = decoded;//here... continue...
      console.log(req.user)
      // Check if the path is allowed for the user's role
      if (userRole && allowedPaths[userRole]) {
        const allowedPathUrls = allowedPaths[userRole].map((pathInfo) => pathInfo.url);

        // Check if the requested URL matches an allowed path for the user's role
        if (allowedPathUrls.some((allowedUrl) => allowedUrl.test(req.url))) {
          return next(); // User is authorized to access this path
        }
      }

      // Path is not allowed for the user's role, return Unauthorized
      return res.status(401).json({ message: "Unauthorized!" });
    });
  };
}

module.exports = authJwt;
