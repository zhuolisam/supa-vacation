import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import Card from '@/components/Card';
import { ExclamationIcon } from '@heroicons/react/outline';
import axios from 'axios';
import { useSession } from 'next-auth/react';

const Grid = ({ homes = [] }) => {

  const { data: session } = useSession()
  const [favouriteHomes, setfavouriteHomes] = useState([]);
  const isEmpty = homes.length === 0;

  const toggleFavorite = async (id) => {
    // remove home from the authenticated user's favorites
    if (favouriteHomes.length != 0 && favouriteHomes?.find(favouriteHome => favouriteHome === id)) {
      setfavouriteHomes(favouriteHomes.filter(favouriteHome => favouriteHome !== id));
      try {
        const { data } = await axios.delete(`/api/user/favourites/${id}`, { userId: session.user.id });
      } catch (e) {
        console.log('error: ', e);
      }
      return;
    }

    setfavouriteHomes([...favouriteHomes, id]);
    try {
      const { data } = await axios.put(`/api/user/favourites/${id}`, { userId: session.user.id });
    } catch (e) {
      console.log('error: ', e);
    }
  };

  useEffect(() => {
    async function fetchFavourites() {
      if (session?.user) {
        try {
          const { data } = await axios.get(`/api/user/favourites`, { id: session.user.id });
          setfavouriteHomes(data.map(home => home.id));
        } catch (e) {
          console.log('error: ', e);
        }
      }
    }
    fetchFavourites();
  }, [session?.user])

  return isEmpty ? (
    <p className="text-amber-700 bg-amber-100 px-4 rounded-md py-2 max-w-max inline-flex items-center space-x-1">
      <ExclamationIcon className="shrink-0 w-5 h-5 mt-px" />
      <span>Unfortunately, there is nothing to display yet.</span>
    </p>
  ) : (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {homes.map(home => (
        <Card key={home.id} {...home} onClickFavorite={toggleFavorite}
          favourite={
            favouriteHomes?.find(favouriteHome => favouriteHome === home.id)
          } />
      ))}
    </div>
  );
};

Grid.propTypes = {
  homes: PropTypes.array,
};

export default Grid;
