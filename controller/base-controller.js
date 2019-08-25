class MSKBaseController {
    static async create(obj) {
        return await this.model().create(obj)
            .then((newUser) => {
                return newUser;
            })
            .catch((err) => {
                return err;
            });
    }

    static async delete(id) {
        let user = await this.getUserBy('id', id);
        if (user) {
            return user.destroy();
        } else {
            return false;
        }
    }

    static async getUserBy(by, val) {
        let user;
        switch (by) {
            case 'id':
                user = await this.model().findByPk(val);
                break;
        }

        return user;
    }

    static model() {
        // return model
    }
}

module.exports = MSKBaseController;