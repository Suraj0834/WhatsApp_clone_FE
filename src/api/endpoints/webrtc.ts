import axios from '../axios';

export const webrtcApi = {
    /**
     * Get WebRTC configuration (STUN/TURN servers)
     */
    getConfig: async () => {
        const response = await axios.get('/webrtc/config');
        return response.data;
    },
};
