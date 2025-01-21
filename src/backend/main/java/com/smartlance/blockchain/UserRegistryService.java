package com.smartlance.blockchain;

import com.smartlance.blockchain.UserRegistry;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.web3j.crypto.Credentials;
import org.web3j.protocol.Web3j;
import org.web3j.protocol.http.HttpService;
import org.web3j.tx.gas.DefaultGasProvider;

@Service
public class UserRegistryService {

    //private final UserRegistry userRegistry;

    /*public UserRegistryService(
            @Value("${blockchain.url}") String blockchainUrl,
            @Value("${blockchain.privateKey}") String privateKey,
            @Value("${blockchain.userRegistryAddress}") String contractAddress
    ) {
        Web3j web3j = Web3j.build(new HttpService(blockchainUrl));
        Credentials credentials = Credentials.create(privateKey);
        this.userRegistry = UserRegistry.load(contractAddress, web3j, credentials, new DefaultGasProvider());
    }*/


    /*public void registerUser(String username, String bio) throws Exception {
        userRegistry.registerUser(username, bio).send();
    }

    public String getUserInfo(String userAddress) throws Exception {
        return userRegistry.getUserInfo(userAddress).send().component2();
    }*/
}