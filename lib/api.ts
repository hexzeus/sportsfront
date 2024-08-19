import axios from 'axios';
import { Bet } from './types';

// Use the deployed backend URL for all requests
const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://sportsback.onrender.com/api';

export const fetchBets = async (): Promise<Bet[]> => {
    const response = await axios.get(`${BASE_URL}/bets`);
    return response.data;
};

export const fetchBetById = async (id: number): Promise<Bet> => {
    const response = await axios.get(`${BASE_URL}/bets/${id}`);
    return response.data;
};

export const createBet = async (bet: Omit<Bet, 'id'>, token: string): Promise<Bet> => {
    const response = await axios.post(`${BASE_URL}/bets`, bet, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return response.data;
};

export const updateBet = async (id: number, bet: Bet, token: string): Promise<Bet> => {
    const response = await axios.put(`${BASE_URL}/bets/${id}`, bet, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return response.data;
};

export const deleteBet = async (id: number, token: string): Promise<void> => {
    await axios.delete(`${BASE_URL}/bets/${id}`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
};
