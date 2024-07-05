import { atom, selector } from 'recoil';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../config/firebaseConfig';

interface AuthState {
  token: string;
}

export const authState = atom<AuthState | null>({
  key: 'authState',
  default: null,
  effects_UNSTABLE: [
    ({ setSelf, onSet }) => {
      const savedAuth = localStorage.getItem('token');
      if (savedAuth) {
        setSelf({ token: savedAuth });
      }

      onSet((newAuth) => {
        if (newAuth === null) {
          localStorage.removeItem('token');
        } else {
          localStorage.setItem('token', newAuth.token);
        }
      });
    },
  ],
});

export const categories = selector({
  key: 'categories',
  get: async () => {
    try {
      const timestamp = new Date().getTime();
      const response = await fetch(`${import.meta.env.VITE_MOCKUP_EXPO_API}/api/categories`);
      return (await response.json()) || [];
    } catch (error) {
      console.log(`Error: \n${error}`);
      return [];
    }
  },
});

export const themes = selector({
  key: 'themes',
  get: async () => {
    try {
      const timestamp = new Date().getTime();
      const response = await fetch(`${import.meta.env.VITE_MOCKUP_EXPO_API}/api/themes`);
      return (await response.json()) || [];
    } catch (error) {
      console.log(`Error: \n${error}`);
      return [];
    }
  },
});

export const audienceTypes = selector({
  key: 'audienceTypes',
  get: async () => {
    try {
      const timestamp = new Date().getTime();
      const response = await fetch(`${import.meta.env.VITE_MOCKUP_EXPO_API}/api/audience_types`);
      return (await response.json()) || [];
    } catch (error) {
      console.log(`Error: \n${error}`);
      return [];
    }
  },
});

export const locationTypes = selector({
  key: 'locationTypes',
  get: async () => {
    try {
      const timestamp = new Date().getTime();
      const response = await fetch(`${import.meta.env.VITE_MOCKUP_EXPO_API}/api/location_types`);
      return (await response.json()) || [];
    } catch (error) {
      console.log(`Error: \n${error}`);
      return [];
    }
  },
});

export const expoList = selector<Exhibitions[]>({
  key: 'expoList',
  get: async () => {
    try {
      const timestamp = new Date().getTime();
      const response = await fetch(`${import.meta.env.VITE_MOCKUP_EXPO_API}/api/exhibitions`);
      return (await response.json()) || [];
    } catch (error) {
      console.log(`Error: \n${error}`);
      return [];
    }
  },
});

export const userList = selector<Users[]>({
  key: 'userList',
  get: async () => {
    try {
      const timestamp = new Date().getTime();
      const response = await fetch(`${import.meta.env.VITE_MOCKUP_EXPO_API}/api/users`);
      return (await response.json()) || [];
    } catch (error) {
      console.log(`Error: \n${error}`);
      return [];
    }
  },
});

export const reviewList = selector<NormalizedReviews[]>({
  key: 'reviewList',
  get: async () => {
    try {
      const timestamp = new Date().getTime();
      const fakeApiResponse = await fetch(`${import.meta.env.VITE_MOCKUP_EXPO_API}/api/reviews`);
      const fakeApiReviews: Reviews[] = await fakeApiResponse.json();

      const normalizedFakeApiReviews: NormalizedReviews[] = fakeApiReviews.map((review) => ({
        ...review,
        review_id: review.review_id.toString(),
        user_id: review.user_id.toString(),
        user_name: '',
      }));

      const querySnapshot = await getDocs(collection(db, "reviews"));
      const firebaseReviews: NormalizedReviews[] = querySnapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          review_id: doc.id,
          user_id: data.user_id,
          user_name: data.user_name,
          exhibition_id: data.exhibition_id,
          rating: data.rating,
          comment: data.comment,
          created_at: data.timestamp.toDate().toISOString(),
          updated_at: data.timestamp.toDate().toISOString(),
        };
      });

      return [...normalizedFakeApiReviews, ...firebaseReviews];
    } catch (error) {
      console.log(`Error fetching reviews: ${error}`);
      return [];
    }
  },
});

export const averageRatingData = selector({
  key: 'averageRatingData',
  get: ({ get }) => {
    const timestamp = new Date().getTime();
    const reviews = get(reviewList);
    
    const ratingData = reviews.reduce((acc, review) => {
      if (!acc[review.exhibition_id]) {
        acc[review.exhibition_id] = { totalRating: 0, count: 0 };
      }
      acc[review.exhibition_id].totalRating += review.rating;
      acc[review.exhibition_id].count += 1;
      return acc;
    }, {} as { [key: number]: { totalRating: number; count: number } });
    
    return Object.keys(ratingData).reduce((acc, exhibitionId) => {
      const id = parseInt(exhibitionId);
      acc[id] = {
        averageRating: ratingData[id].totalRating / ratingData[id].count,
        count: ratingData[id].count * 65,
      };
      return acc;
    }, {} as { [key: number]: { averageRating: number; count: number } });
  },
});

export const individualRatingData = selector({
  key: 'individualRatingData',
  get: ({ get }) => {
    const timestamp = new Date().getTime();
    const reviews = get(reviewList);

    return reviews.reduce((acc, review) => {
      const exhibitionId = review.exhibition_id;
      const userId = review.user_id.toString();

      if (!acc[exhibitionId]) {
        acc[exhibitionId] = {};
      }

      if (
        !acc[exhibitionId][userId] ||
        new Date(review.created_at) > new Date((acc[exhibitionId][userId] as NormalizedReviews).created_at)
      ) {
        acc[exhibitionId][userId] = review;
      }

      return acc;
    }, {} as { [exhibition_id: number]: { [user_id: string]: NormalizedReviews } });
  },
});

export const cartItemList = atom({
  key: 'cartItem',
  default: {},
  effects: [
    ({ setSelf, onSet }) => {
      localStorage.getItem('CART_ITEM') &&
      setSelf(JSON.parse(localStorage.getItem('CART_ITEM') as string));
      onSet((value) => localStorage.setItem('CART_ITEM', JSON.stringify(value)));
    },
  ],
});

export const sections = [
  { displayName: 'Wishlists', path: 'wishlists' },
  { displayName: 'My Reviews', path: 'myReviews' },
];

export interface Exhibitions {
  exhibition_id: number;
  name: string;
  description: string;
  category_id: number;
  theme_id: number;
  audience_type_id: number;
  price: number;
  location: string;
  location_type_id: number;
  start_date: string;
  end_date: string;
  image_url: string;
  created_at: string;
  updated_at: string;
  quantity: number;
  selectedVisitDate: Date; 
}

export interface Users {
  user_id: number;
  name: string;
  email: string;
  password: string;
  token: string;
}

export interface Reviews {
  review_id: number;
  user_id: number;
  exhibition_id: number;
  rating: number;
  comment: string;
  created_at: string;
  updated_at: string;
}

export interface NormalizedReviews {
  review_id: string;
  user_id: number | string;
  exhibition_id: number;
  rating: number;
  comment: string;
  created_at: string;
  updated_at: string;
  user_name: string;
}

export interface Category {
  category_id: number;
  name: string;
}

export interface Theme {
  theme_id: number;
  name: string;
}

export interface AudienceType {
  audience_type_id: number;
  name: string;
}

export interface LocationType {
  location_type_id: number;
  name: string;
}