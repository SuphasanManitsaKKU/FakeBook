package com.kku.testapi.repository;

import com.kku.testapi.entity.FriendRequest;
import com.kku.testapi.entity.RequestStatus;
import com.kku.testapi.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface FriendRequestRepository extends JpaRepository<FriendRequest, Integer> {
    List<FriendRequest> findByReceiverAndStatus(User receiver, RequestStatus status);
    List<FriendRequest> findBySenderAndStatus(User sender, RequestStatus status);
    boolean existsBySenderAndReceiverAndStatus(User sender, User receiver, RequestStatus status);
}
