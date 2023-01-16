import prisma from '@/lib/prisma';

export default async function handler(req, res) {
    // // Check if user is authenticated
    // const session = await getSession({ req });
    // if (!session) {
    //     return res.status(401).json({ message: 'Unauthorized.' });
    // }

    // // Retrieve the authenticated user
    // const user = await prisma.user.findUnique({
    //     where: { email: session.user.email },
    //     select: { listedHomes: true },
    // });

    const { id } = req.query;

    if (req.method === 'GET') {
        try {
            const fav = await prisma.home.findMany({
                where: {
                    userFavourited: {
                        some: {
                            userId: id
                        }
                    }
                }
            })
            res.status(200).json(fav);
        } catch (e) {
            console.log(e)
            res.status(500).json({ message: 'Something went wrong' });
        }
    }
    // HTTP method not supported!
    else {
        res.setHeader('Allow', ['GET']);
        res
            .status(405)
            .json({ message: `HTTP method ${req.method} is not supported.` });
    }
}