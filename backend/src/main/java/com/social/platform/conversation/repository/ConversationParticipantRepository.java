package com.social.platform.conversation.repository;

import com.social.platform.conversation.model.ConversationParticipant;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface ConversationParticipantRepository
        extends JpaRepository<
        ConversationParticipant,
        Long
        > {

    boolean existsByConversationIdAndUserId(
            Long conversationId,
            Long userId
    );

    Optional<ConversationParticipant>
    findByConversationIdAndUserId(
            Long conversationId,
            Long userId
    );

    @Query("""
        select cp
        from ConversationParticipant cp
        join fetch cp.conversation c
        where cp.user.id = :userId
        order by c.createdAt desc
    """)
    List<ConversationParticipant>
    findConversationsForUser(Long userId);

    List<ConversationParticipant>
    findByConversationId(Long conversationId);
}
