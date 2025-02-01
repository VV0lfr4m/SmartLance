package com.smartlance.blockchain;

import com.smartlance.blockchain.UserRegistry;
import com.smartlance.models.User;
import com.smartlance.services.user.IUserService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.web3j.crypto.Credentials;
import org.web3j.protocol.Web3j;
import org.web3j.protocol.core.methods.response.TransactionReceipt;
import org.web3j.protocol.http.HttpService;
import org.web3j.tuples.generated.Tuple2;
import org.web3j.tx.gas.DefaultGasProvider;
import org.web3j.tx.ReadonlyTransactionManager;

@Service
public class UserRegistryService {

    private final Web3j web3j;
    private final UserRegistry userRegistry;
    private final IUserService userService;

    public UserRegistryService(
            @Value("${blockchain.url}") String blockchainUrl,
            @Value("${blockchain.userRegistryAddress}") String contractAddress,
            IUserService userService
    ) {
        this.web3j = Web3j.build(new HttpService(blockchainUrl));
        // Не використовуємо приватний ключ
        // Використання ReadOnlyTransactionManager для читання даних
        ReadonlyTransactionManager txManager = new ReadonlyTransactionManager(web3j, null);

        // Завантаження контракту
        this.userRegistry = UserRegistry.load(contractAddress, web3j, txManager, new DefaultGasProvider());

        this.userService = userService;
    }

    public void syncUserData(String transactionHash) throws Exception {

        // Отримання квитанції про транзакцію
        TransactionReceipt receipt = web3j.ethGetTransactionReceipt(transactionHash)
                .send()
                .getTransactionReceipt()
                .orElseThrow(() -> new RuntimeException("Transaction not found"));

        if (!receipt.isStatusOK()) {
            throw new RuntimeException("Transaction failed");
        }

        // Зчитування даних з контракту
        String userAddress = receipt.getFrom();
        Tuple2<String, String> userInfo = userRegistry.getUserInfo(userAddress).send();

        String username = userInfo.component1();
        String bio = userInfo.component2();


    }

    public void registerUser(String username, String bio) throws Exception {
        // Збереження даних у базу
        User user = new User();
        user.setUsername(username);
        user.setBio(bio);
        userService.registerUser(user);

        userRegistry.registerUser(username, bio).send();
    }

    public String getUserInfo(String userAddress) throws Exception {
        // Зчитування даних з контракту
        Tuple2<String, String> userInfo = userRegistry.getUserInfo(userAddress).send();
        return userInfo.toString();
    }
}