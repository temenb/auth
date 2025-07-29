import { Request, Response } from 'express';
import * as authService from '../services/auth.service';

export const test = async (req: Request, res: Response) => {
    res.status(201).json('test ok');
};

export const register = async (req: Request, res: Response) => {
    res.status(201).json('test ok');
    // const { email, password } = req.body;
    // try {
    //     const user = await authService.register(email, password);
    //     res.status(201).json(user);
    // } catch (error: any) {
    //     res.status(400).json({ message: error.message });
    // }
};

export const login = async (req: Request, res: Response) => {
    const { email, password } = req.body;
    try {
        const tokens = await authService.login(email, password);
        res.status(200).json(tokens);
    } catch (error: any) {
        res.status(400).json({ message: error.message });
    }
};

export const refreshToken = async (req: Request, res: Response) => {
    const { refreshToken } = req.body;
    try {
        const tokens = await authService.refreshTokens(refreshToken);
        res.status(200).json(tokens);
    } catch (error: any) {
        res.status(400).json({ message: error.message });
    }
};

export const logout = async (req: Request, res: Response) => {
    const userId = (req as any).userId;
    await authService.logout(userId);
    res.status(200).json({ message: 'Logged out successfully' });
};

export const getProfile = async (req: Request, res: Response) => {
    const userId = (req as any).userId;
    const profile = await authService.getProfile(userId);
    res.status(200).json(profile);
};
