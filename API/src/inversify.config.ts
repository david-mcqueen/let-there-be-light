import { Container, interfaces } from "inversify";
import { TYPES } from './types';
import IChannel from './interfaces/IChannel';
import Channel from './Channel';
import MockChannel from "./__mocks__/MockChannel";


const inversifyConfig = new Container();

if (process.env.NODE_ENV == "test") {
    console.log("TESTING");

    inversifyConfig.bind<interfaces.Newable<IChannel>>(TYPES.IChannel).toConstructor<MockChannel>(MockChannel)

}else {
    inversifyConfig.bind<interfaces.Newable<IChannel>>(TYPES.IChannel).toConstructor<Channel>(Channel);
}


export { inversifyConfig };