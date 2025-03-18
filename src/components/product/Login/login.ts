import type { NextApiRequest, NextApiResponse } from "next";

const authenticateUser = (username: string, password: string) => {
    if (username === "xanleevue" && password === "admin123") {
        return { token: "admin-token", role: "admin" };
    } else if (username === "xanleevue" && password === "user123") {
        return { token: "user-token", role: "user" };
    }
    return null;
};

export default function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === "POST") {
        const { username, password } = req.body;
        const authResponse = authenticateUser(username, password);

        if (authResponse) {
            res.status(200).json(authResponse);
        } else {
            res.status(401).json({ message: "Invalid username or password" });
        }
    } else {
        res.status(405).json({ message: "Method not allowed" });
    }
}