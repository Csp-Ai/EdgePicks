# UI Components Guide

This guide summarizes the main React components used to render prediction flows and agent insights in the EdgePicks UI.

## AgentNodeGraph

Displays a node for each registered agent and animates their status during execution. Active agents pulse and errored agents turn red, providing a quick visual of system activity.

## MatchupInputForm

Interactive form for entering home team, away team, and week. Submitting the form streams agent results via an EventSource connection and triggers lifecycle callbacks as data arrives.

## AgentLeaderboardPanel

Aggregates per‑agent performance stats. For each agent, the panel calculates average confidence, total score, and number of evaluations, presenting them in a sorted list.

## AgentDebugPanel

Developer‑focused view showing detailed agent outputs. It lists each agent with its raw and weighted scores, reason text, and any warnings. Mobile layouts use stacked cards while desktop displays a sortable table.

## Additional Components

The `components/` directory includes many other UI pieces such as `AgentCard`, `AgentStatusPanel`, `ScoreBar`, and more. These building blocks combine to deliver transparent predictions and rich debugging information.

