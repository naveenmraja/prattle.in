import { configureStore } from '@reduxjs/toolkit';
import prattleReducer from '../features/user/PrattleSlice';

export const store = configureStore({
    reducer: {
        prattle : prattleReducer
    }
});