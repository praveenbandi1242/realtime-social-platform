CREATE TABLE conversations (
    id BIGSERIAL PRIMARY KEY,

    type VARCHAR(20) NOT NULL,

    direct_key VARCHAR(100),

    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT conversations_type_check
        CHECK (type IN ('DIRECT', 'GROUP'))
);

CREATE UNIQUE INDEX uk_conversations_direct_key
    ON conversations (direct_key)
    WHERE direct_key IS NOT NULL;


CREATE TABLE conversation_participants (
    id BIGSERIAL PRIMARY KEY,

    conversation_id BIGINT NOT NULL,

    user_id BIGINT NOT NULL,

    joined_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_conversation_participant_conversation
        FOREIGN KEY (conversation_id)
        REFERENCES conversations(id)
        ON DELETE CASCADE,

    CONSTRAINT fk_conversation_participant_user
        FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE CASCADE,

    CONSTRAINT uk_conversation_participant
        UNIQUE (conversation_id, user_id)
);


CREATE INDEX idx_conversation_participants_user
    ON conversation_participants(user_id);

CREATE INDEX idx_conversation_participants_conversation
    ON conversation_participants(conversation_id);