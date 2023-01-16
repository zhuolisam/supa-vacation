import { getSession } from 'next-auth/react';

import prisma from '@/lib/prisma';

export default async function handler(req, res) {
    const session = await getSession({ req })
    if (!session) {
        return res.status(401).json({ message: 'Unauthorized.' })
    }

    // Retrieve the authenticated user
    const user = await prisma.user.findUnique({
        where: { email: session.user.email },
    });

    const userId = user.id;
    const homeId = req.query.homeId;

    // Add favourite
    if (req.method === 'PUT') {
        try {
            //link user with the favourite home in the model userFavouriteHomes
            const home = await prisma.home.update({
                where: {
                    id: homeId
                },
                data: {
                    userFavourited: {
                        create: [{
                            user: {
                                connect: {
                                    id: userId
                                }
                            }
                        }]
                    }
                },
            })
            res.status(200).json(home);
        } catch (e) {
            console.log(e)
            res.status(500).json({ message: 'Something went wrong' });
        }
    }

    // Delete home
    else if (req.method === 'DELETE') {
        try {
            //IN-DEV: Delete favourite
            const home = await prisma.userFavouriteHomes.delete({
                where: {
                    userId_homeId:
                    {
                        userId: userId,
                        homeId: homeId
                    }
                }
            })
            res.status(200).json(home);
        } catch (e) {
            console.log(e)
            res.status(500).json({ message: 'Something went wrong' });
        }
    }
    // HTTP method not supported!
    else {
        res.setHeader('Allow', ['PUT', 'DELETE']);
        res
            .status(405)
            .json({ message: `HTTP method ${req.method} is not supported.` });
    }
}