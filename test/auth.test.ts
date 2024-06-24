import { AuthService } from "./AuthService.js";

async function testAuth() {
    const service = new AuthService();
    const loginResult = await service.login('erickuser1', 'UKP5xvy*bkq*yjy3vtv');

    console.log(loginResult);
}

testAuth();