package com.social.platform.conversation.repository;

import com.social.platform.conversation.model.Conversation;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface ConversationRepository
        extends JpaRepository<Conversation, Long> {

    Optional<Conversation> findByDirectKey(String directKey);
}
