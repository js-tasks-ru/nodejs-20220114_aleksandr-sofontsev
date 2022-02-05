const Validator = require('../Validator');
const expect = require('chai').expect;

describe('testing-configuration-logging/unit-tests', () => {
  describe('Validator', () => {
    const validator = new Validator({
      name: {
        type: 'string',
        min: 10,
        max: 20,
      },
      age: {
        type: 'number',
        min: 18,
        max: 27,
      },
    });

    it('валидатор проверяет строковые поля', () => {
      const errors = validator.validate({name: 'Lalala', age: 25});

      expect(errors).to.have.length(1);
      expect(errors[0]).to.have.property('field').and.to.be.equal('name');
      expect(errors[0]).to.have.property('error').and.to.be.equal('too short, expect 10, got 6');
    });

    it('валидатор проверяет строковые поля', () => {
      const errors = validator.validate({name: 'LalalaLalalaLalalaLalalaLalala', age: 25});

      expect(errors).to.have.length(1);
      expect(errors[0]).to.have.property('field').and.to.be.equal('name');
      expect(errors[0]).to.have.property('error').and.to.be.equal('too long, expect 20, got 30');
    });

    it('валидатор проверяет числовые поля', () => {
      const errors = validator.validate({name: 'LalalaLalala', age: 10});

      expect(errors).to.have.length(1);
      expect(errors[0]).to.have.property('field').and.to.be.equal('age');
      expect(errors[0]).to.have.property('error').and.to.be.equal('too little, expect 18, got 10');
    });

    it('валидатор проверяет числовые поля', () => {
      const errors = validator.validate({name: 'LalalaLalala', age: 35});

      expect(errors).to.have.length(1);
      expect(errors[0]).to.have.property('field').and.to.be.equal('age');
      expect(errors[0]).to.have.property('error').and.to.be.equal('too big, expect 27, got 35');
    });

    it('валидатор проверяет соответствие типов', () => {
      const errors = validator.validate({name: 35, age: 30});

      expect(errors).to.have.length(1);
      expect(errors[0]).to.have.property('field').and.to.be.equal('name');
      expect(errors[0]).to.have.property('error').and.to.be.equal('expect string, got number');
    });

    it('валидатор проверяет соответствие типов', () => {
      const errors = validator.validate({name: 'LalalaLalala', age: 'LalalaLalala'});

      expect(errors).to.have.length(1);
      expect(errors[0]).to.have.property('field').and.to.be.equal('age');
      expect(errors[0]).to.have.property('error').and.to.be.equal('expect number, got string');
    });

    it('валидатор не находит ошибок', () => {
      const errors = validator.validate({name: 'LalalaLalala', age: 25});
      expect(errors).to.have.length(0);
    });
  });
});
