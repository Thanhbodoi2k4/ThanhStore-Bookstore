import axios from 'axios'

const baseURL = process.env.REACT_APP_SERVER_URL || 'http://localhost:5000/api/v1/'

const chatApi = {
    sendMessage: async (message, history = []) => {
        const response = await axios.post(`${baseURL}chat`, {
            message,
            history
        })
        return response.data
    }
}

export default chatApi
