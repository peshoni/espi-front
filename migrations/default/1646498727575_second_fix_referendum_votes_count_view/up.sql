CREATE OR REPLACE VIEW referendum_countings as 
select 
t."questionId", 
count(t."eVote") + COUNT(t."vote") as "votesCount", 
count(*) FILTER (WHERE t."eVote" = true OR t."vote" = TRUE) AS "votesTrue", 
count(*) FILTER (WHERE t."eVote" = false OR t."vote" = FALSE) AS "votesFalse",
count(*) FILTER (WHERE t."eVote" IS NOT NULL) AS "evoted",
count(*) FILTER (WHERE t."vote" IS NOT NULL) AS "voted"
from referendum_votes t
inner join (
select max("referendum_votes"."id") as "maxId", "referendum_votes"."userId", "referendum_votes"."questionId" 
from referendum_votes
group by "referendum_votes"."userId", "referendum_votes"."questionId") 
tm on t.id = tm."maxId"
group by t."questionId";
