// import { NextApiRequest, NextApiResponse } from "next";
// import { Product } from "./carStore"; // Assuming you're using Prisma

// export default async function handler(req: NextApiRequest, res: NextApiResponse) {
//   if (req.method === "POST") {
//     try {
//       const { productId, name, price, quantity, color, size } = req.body;

//       const cartItem = await Product.cart.create({
//         data: {
//           productId,
//           name,
//           price,
//           quantity,
//           color,
//           size,
//         },
//       });

//       res.status(200).json({ message: "Item added to cart", cartItem });
//     } catch (error) {
//       console.error("Error saving cart item:", error);
//       res.status(500).json({ message: "Internal Server Error" });
//     }
//   } else {
//     res.setHeader("Allow", ["POST"]);
//     res.status(405).json({ message: `Method ${req.method} Not Allowed` });
//   }
// }
