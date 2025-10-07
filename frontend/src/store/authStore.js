import { create } from "zustand";
import axios from "axios";

const useAuthStore = create((set, get) => ({
    authUser: null,
    profileData : null,
    loading: false,
    error: null,

    // Signup method
    signup: async (formData) => {
        set({ loading: true, error: null });
        try {
            const res = await axios.post("http://localhost:5000/api/auth/signup", {
                fullName: formData.name,
                email: formData.email,
                password: formData.password,
                profilePic: formData.profilePic || null
            },
                { withCredentials: true }
            );

            set({ authUser: res.data });

        } catch (err) {
            console.error(err);
            set({
                error:
                    err.response?.data?.message ||
                    "Signup failed. Please try again later.",
            });
            throw err;
        } finally {
            set({ loading: false });
        }
    },

    // Login method
    login: async (email, password) => {
        set({ loading: true, error: null });
        try {
            const res = await axios.post("http://localhost:5000/api/auth/login", { email, password }, { withCredentials: true });
            set({ authUser: res.data });

        } catch (err) {
            console.error(err);
            set({
                error:
                    err.response?.data?.message ||
                    "Login failed. Please try again later.",
            });
            throw err;
        } finally {
            set({ loading: false });
        }
    },

    // Logout method
    logout: async () => {
    try {
        await axios.post(
            "http://localhost:5000/api/auth/logout",
            {}, // body
            { withCredentials: true } // send cookies
        );
        set({ authUser: null });
    } catch (error) {
        toast.error(error.response?.data?.message || "Logout failed");
    }
},


    // Load user from localStorage on app init
    loadUser: async () => {
        set({ loading: true });
        try {
            const res = await axios.get("http://localhost:5000/api/auth/check", { withCredentials: true });
            set({ authUser: res.data });
        } catch (error) {
            console.log("Error in checkAuth: ", error);
            set({ authUser: null });
        } finally {
            set({ loading: false });
        }
    },

    fetchProfile: async () => {
        set({ loading: true, error: null });
        try {
            const res = await axios.get("http://localhost:5000/api/users/profile", {
                withCredentials: true, // if you use cookies for auth
            });

            set({ profileData: res.data, loading: false });
        } catch (err) {
            set({ error: err.response?.data?.message || err.message, loading: false });
        }
    },

}));

export default useAuthStore;
