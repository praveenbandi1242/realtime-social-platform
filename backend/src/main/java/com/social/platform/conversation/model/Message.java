package com.social.platform.conversation.model;

import com.social.platform.entity.User;

import jakarta.persistence.*;

import lombok.*;

import java.time.Instant;

@Entity
@Table(
        name = "messages",
        indexes = {
                @Index(
                        name = "idx_messages_conversation_created",
                        columnList = "conversation_id, created_at"
                ),
                @Index(
                        name = "idx_messages_sender",
                        columnList = "sender_id"
                )
        }
)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Message {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;


    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(
            name = "conversation_id",
            nullable = false
    )
    private Conversation conversation;


    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(
            name = "sender_id",
            nullable = false
    )
    private User sender;


    @Column(
            nullable = false,
            columnDefinition = "TEXT"
    )
    private String content;


    @Column(
            name = "created_at",
            nullable = false,
            updatable = false
    )
    private Instant createdAt;


    @PrePersist
    protected void onCreate() {

        if (createdAt == null) {
            createdAt = Instant.now();
        }
    }
}