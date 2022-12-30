function hello(value: string | undefined) {
  if (typeof value === "string") {
    console.log(`Hello ${value}`);
  } else {
    throw new Error(`Can not greet 'undefined'!`);
  }
}

hello("world!");
