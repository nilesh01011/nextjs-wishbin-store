import bcrypt from 'bcryptjs';
import { client } from '../../../sanity';

export default async function (req, res) {
    if (req.method === 'POST') {

        if (!req.body) return res.status(404).json({ error: "Don't have form data" });

        // const response = JSON.parse(req.body);

        const { email, password, username, mobile_number, address } = req.body;

        const user = await client.fetch(`*[_type == "user" && email == $email][0]`, {
            email: email,
        });

        if (user) return res.status(422).json({ message: "User Already Exists...!" });
        // password bcrypt
        const passwordProtect = bcrypt.hashSync(password);

        // get user data and added to the sanity.io account
        const createUser = await client.create({ _type: 'user', email, passwordProtect, username, mobile_number, address });
        // Set the user data cookies

        res.status(200).json({ ...createUser });

    } else {
        res.status(500).json({ message: "HTTP method not valid only POST Accepted" })
    }
}