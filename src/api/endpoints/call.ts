import axios from '../axios';

interface CreateCallLogData {
    conversationId: string;
    calleeIds: string[];
    callType: 'audio' | 'video';
}

interface UpdateCallLogData {
    status?: 'missed' | 'answered' | 'declined' | 'failed';
    duration?: number;
    endedAt?: Date;
}

export const callApi = {
    /**
     * Create a new call log
     */
    createCallLog: async (data: CreateCallLogData) => {
        const response = await axios.post('/calls', data);
        return response.data;
    },

    /**
     * Update call log
     */
    updateCallLog: async (callId: string, data: UpdateCallLogData) => {
        const response = await axios.patch(`/calls/${callId}`, data);
        return response.data;
    },

    /**
     * Get call history
     */
    getCallHistory: async (limit = 50, skip = 0) => {
        const response = await axios.get('/calls', {
            params: { limit, skip },
        });
        return response.data;
    },

    /**
     * Get call log by ID
     */
    getCallLog: async (callId: string) => {
        const response = await axios.get(`/calls/${callId}`);
        return response.data;
    },

    /**
     * Delete call log
     */
    deleteCallLog: async (callId: string) => {
        await axios.delete(`/calls/${callId}`);
    },
};
