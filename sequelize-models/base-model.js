class BaseModel {
    model() {
        //sequelize model goes here
    }

    getAttributes() {
        this.model().rawAttributes;
    }
}

module.exports = BaseModel;