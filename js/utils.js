const host = 'http://api.wisey.app';
const version = 'api/v1';

class Utils {
    token = null;

    async getToken() {
        try {
            const { token } = await fetch(`${host}/${version}/auth/anonymous?platform=subscriptions`,
                {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }).then(response => response.json());
            this.token = token;
            return token;
        } catch (error) {
            console.error('Error fetching token:', error);
            return null;
        }
    }

    async reciveCourses() {
        if (!this.token) {
            await this.getToken();
        }
        if (!this.token) {
            throw new Error('Failed to get token');
        }
        try {
            const { courses } = await fetch(`${host}/${version}/core/preview-courses`,
                {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + this.token
                    }
                }).then(response => response.json());
            return courses;
        } catch (error) {
            console.error('Error fetching courses:', error);
            throw new Error('Failed to fetch courses');
        }
    }

    async reciveCourse(courseId) {
        if (!this.token) {
            await this.getToken();
        }
        try {
            const course = await fetch(`${host}/${version}/core/preview-courses/${courseId}`,
                {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + this.token
                    }
                }).then(response => response.json());
    
            return course;
        } catch (error) {
            console.error('Error fetching course:', error);
            throw new Error('Failed to fetch course');
        }
    }
}

exports = { Utils };
