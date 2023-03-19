const host = 'http://api.wisey.app';
const version = 'api/v1';

class Utils {
    token;

    constructor() {
        this.reciveToken();
    }

    async getToken() {
        try {
            const { token } = await fetch(`${host}/${version}/auth/anonymous?platform=subscriptions`,
                {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }).then(response => response.json());
            return token;
        } catch (error) {
            console.error('Error fetching token:', error);
            return null;
        }
    }

    async reciveToken() {
        if (!this.token) {
            this.token = await this.getToken();
        }
    }

    async reciveCourses() {
        await this.reciveToken();
        if (!this.token) {
            return;
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
            //console.error('Error fetching courses:', error);
            return null;
        }
    }

    async reciveCourse() {
        try {
            const course = await fetch(`${host}/${version}/core/preview-courses/${courseId}`,
                {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + token
                    }
                }).then(response => response.json());
    
            return course;
        } catch (error) {
            console.error('Error fetching course:', error);
            return null;
        }
    }

    sum(n1, n2) {
    
            return n1 + n2;
        
    }
    
}

exports = { Utils }