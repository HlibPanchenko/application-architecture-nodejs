// target - наш класс, но классы это синтаксический сахар над функциями, поэтому target: Function
function Component(id: number) {
  console.log("init component");
  return (target: Function) => {
    console.log("run component");
    // так мы можем достучаться до параметра и поменять его
    target.prototype.id = id;
  };
}
function Logger() {
  console.log("init logger");
  return (target: Function) => {
    console.log("run logger");
  };
}
// декоратор для методов принимает больше параметров
function Method(
  target: Object,
  propertyKey: string, // ключ нашего свойства
  propertyDescriptor: PropertyDescriptor
) {
  console.log(propertyKey); // вернет название функции
  // propertyDescriptor - можем сделать get, set или заменить value
  // умножим переданный id на 10
  propertyDescriptor.value = function (...args: any[]) {
    return args[0] * 10;
  };
}

function Prop(target: Object, propertyKey: string) {
  // можем переопределить getter, setter
  let value: number;

  const getter = () => {
    console.log("Get");
    return value;
  };

  const setter = (newValue: number) => {
    console.log("Set");
    value = newValue;
  };

  // Теперь можем дополнить наше свойство с помощью Object.defineProperty
  Object.defineProperty(target, propertyKey, {
    // мы переопределили getter, setter для value  @Prop id: number;
    // теперь когда мы будем читать или записывать, мы увидим соответствующий getter, setter
    get: getter,
    set: setter,
  });
}

function Param(
  target: Object,
  propertyKey: string,
  index: number // индекс переданного параметра в функцию
) {
  console.log(propertyKey, index);
}
// наш декоратор готов.
// По сути это функция, которая будет исполняться перед тем, как иницилизируется наш класс

@Logger()
@Component(1)
export class User {
  @Prop id: number; // type

  @Method
  updateId(@Param newId: number) {
    this.id = newId;
    return this.id;
  }
}

console.log(new User().id);
console.log(new User().updateId(2));
