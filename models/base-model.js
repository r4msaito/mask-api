class BaseModel {
    constructor() {
        return this.constructor.model().build();
    }

    static async getModelByPK(pk) {
        return await this.model().findByPk(pk);
    }

    static model() {
        //return sequelize model here
    }
}

module.exports = BaseModel;