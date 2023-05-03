import "reflect-metadata";

// Сделаем метадату на класс
function Inject(key: string) {
  return (target: Function) => {
    // сохраним свойство
    Reflect.defineMetadata(key, 1, target);
    // прочитаем его
    const meta = Reflect.getMetadata(key, target);
    console.log(meta);
  };
}

function Prop(target: Object, name: string) {}

@Inject("C")
export class C {
  @Prop prop: number;
}
