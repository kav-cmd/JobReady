// In-memory mock database for development
// This allows the app to function without a real MongoDB instance

class MockDatabase {
    constructor() {
        this.users = [];
        this.videoProgress = [];
    }

    // User methods
    async findUserByEmail(email) {
        return this.users.find(u => u.email === email) || null;
    }

    async findUserByPhone(phone) {
        return this.users.find(u => u.phone === phone) || null;
    }

    async findUserById(id) {
        return this.users.find(u => u._id === id) || null;
    }

    async saveUser(userData) {
        const existingIndex = this.users.findIndex(u => u.email === userData.email);

        if (existingIndex >= 0) {
            this.users[existingIndex] = { ...this.users[existingIndex], ...userData };
            return this.users[existingIndex];
        } else {
            const newUser = {
                _id: `mock_id_${Math.random().toString(36).substr(2, 9)}`,
                ...userData,
                createdAt: new Date(),
                updatedAt: new Date(),
                comparePassword: async function (candidatePassword) {
                    // Simplified for mock: just direct comparison
                    return candidatePassword === this.password;
                }
            };
            this.users.push(newUser);
            return newUser;
        }
    }

    // Video Progress methods
    async getProgress(userId, courseId, videoId) {
        return this.videoProgress.find(p =>
            p.userId === userId && p.courseId === courseId && p.videoId === videoId
        ) || null;
    }

    async saveProgress(progressData) {
        const existingIndex = this.videoProgress.findIndex(p =>
            p.userId === progressData.userId &&
            p.courseId === progressData.courseId &&
            p.videoId === progressData.videoId
        );

        if (existingIndex >= 0) {
            this.videoProgress[existingIndex] = { ...this.videoProgress[existingIndex], ...progressData, updatedAt: new Date() };
            return this.videoProgress[existingIndex];
        } else {
            const newProgress = {
                _id: `mock_progress_${Math.random().toString(36).substr(2, 9)}`,
                ...progressData,
                createdAt: new Date(),
                updatedAt: new Date()
            };
            this.videoProgress.push(newProgress);
            return newProgress;
        }
    }
}

const mockDb = new MockDatabase();
export default mockDb;
