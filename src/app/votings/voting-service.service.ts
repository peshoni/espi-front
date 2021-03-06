import { Injectable } from '@angular/core';
import { ApolloQueryResult, FetchResult } from '@apollo/client';
import { Observable } from 'rxjs';
import {
  AddVoteForTheReferendumGQL,
  AddVoteForTheReferendumMutation,
  CreateReferendumGQL,
  CreateReferendumMutation,
  CreateVotesGQL,
  CreateVotesMutation,
  CreateVotingGQL,
  CreateVotingMutation,
  GetParticipantsInVotingGQL,
  GetParticipantsInVotingQuery,
  GetReferendumsGQL,
  GetStartedReferendumsGQL,
  GetStartedReferendumsQuery,
  GetStartedVotingsGQL,
  GetStartedVotingsQuery,
  GetUpcomingVotingsGQL,
  GetUpcomingVotingsQuery,
  GetVotingCandidatesGQL,
  GetVotingCandidatesQuery,
  GetVotingsGQL,
  MarkVoteAsInSectionGQL,
  MarkVoteAsInSectionMutation,
  Referendums_Bool_Exp,
  Referendums_Insert_Input,
  Referendums_Order_By,
  Referendums_Set_Input,
  Referendum_Questions_Insert_Input,
  Referendum_Votes_Insert_Input,
  UpdateReferendumAndQuestionGQL,
  UpdateReferendumAndQuestionMutation,
  UpdateVotingGQL,
  UpdateVotingMutation,
  VoteGQL,
  VoteMutation,
  Votes_Insert_Input,
  Votings_Bool_Exp,
  Votings_Insert_Input,
  Votings_Order_By,
  Votings_Set_Input,
  Voting_Types_Enum,
} from 'src/generated/graphql';
@Injectable({
  providedIn: 'root', // VotingsModule,
})
export class VotingsService {
  constructor(
    private createReferendumGQL: CreateReferendumGQL,
    private updateReferendumAndQuestionGQL: UpdateReferendumAndQuestionGQL,
    private getReferendumsGQL: GetReferendumsGQL,
    private getStartedReferendumsGQL: GetStartedReferendumsGQL,
    private createVotingGQL: CreateVotingGQL,
    private updateVotingGQL: UpdateVotingGQL,
    private getVotingsGQL: GetVotingsGQL,
    private getUpcomingVotingsGQL: GetUpcomingVotingsGQL,
    private getStartedVotingsGQL: GetStartedVotingsGQL,
    private addVoteForTheReferendumGQL: AddVoteForTheReferendumGQL,
    private getParticipantsInVotingGQL: GetParticipantsInVotingGQL,
    private voteGQL: VoteGQL,
    private markVoteAsInSectionGQL: MarkVoteAsInSectionGQL,
    private createVotesGQL: CreateVotesGQL,
    private getVotingCandidatesGQL: GetVotingCandidatesGQL
  ) {}

  //#region  VOTINGS
  createVoting(
    object: Votings_Insert_Input
  ): Observable<
    FetchResult<CreateVotingMutation, Record<string, any>, Record<string, any>>
  > {
    return this.createVotingGQL.mutate(
      { input: object },
      { errorPolicy: 'all' }
    );
  }
  // FOR DEMO PURPOSES
  createVotes(
    objects: Votings_Insert_Input[]
  ): Observable<
    FetchResult<CreateVotesMutation, Record<string, any>, Record<string, any>>
  > {
    return this.createVotesGQL.mutate(
      { input: objects },
      { errorPolicy: 'all' }
    );
  }

  updateVoting(
    id: number,
    set: Votings_Set_Input
  ): Observable<
    FetchResult<UpdateVotingMutation, Record<string, any>, Record<string, any>>
  > {
    return this.updateVotingGQL.mutate(
      { id, input: set },
      { errorPolicy: 'all' }
    );
  }

  getVotings(
    limit = 10,
    offset = 0,
    condition: Votings_Bool_Exp = {},
    orderBy: Votings_Order_By
  ) {
    return this.getVotingsGQL.watch(
      { limit, offset, condition, orderBy },
      {
        fetchPolicy: 'network-only',
        partialRefetch: true,
        errorPolicy: 'all',
        pollInterval: 5 * 1000,
      }
    );
  }

  getStartedVotings(
    votingSectionSettlementId: number
  ): Observable<ApolloQueryResult<GetStartedVotingsQuery>> {
    let where: Votings_Bool_Exp;
    if (votingSectionSettlementId) {
      where = {
        _and: [
          { locked: { _eq: true } },
          { startedAt: { _is_null: false } },
          { finishedAt: { _is_null: true } },
          {
            _or: [
              // global or local
              {
                _and: [
                  {
                    voting_type: {
                      value: {
                        _in: [
                          Voting_Types_Enum.Parliamentary,
                          Voting_Types_Enum.Presidential,
                        ],
                      },
                    },
                  },
                  { settlementId: { _is_null: true } },
                ],
              },
              {
                _and: [
                  { settlementId: { _eq: votingSectionSettlementId } },
                  {
                    voting_type: {
                      value: {
                        _in: [
                          Voting_Types_Enum.LocalGovernment,
                          Voting_Types_Enum.Mayoral,
                        ],
                      },
                    },
                  },
                ],
              },
            ],
          },
        ],
      };
    } else {
      where = {
        _and: [
          { locked: { _eq: true } },
          { startedAt: { _is_null: false } },
          { finishedAt: { _is_null: true } },
        ],
      };
    }

    return this.getStartedVotingsGQL.fetch(
      { where },
      { fetchPolicy: 'network-only' }
    );
  }

  public getUpcomingVotings(
    startDate: Date
  ): Observable<ApolloQueryResult<GetUpcomingVotingsQuery>> {
    return this.getUpcomingVotingsGQL.fetch(
      { startDate },
      { fetchPolicy: 'network-only' }
    );
  }

  getParticipantsInVoting(
    votingId: number
  ): Observable<ApolloQueryResult<GetParticipantsInVotingQuery>> {
    return this.getParticipantsInVotingGQL.fetch(
      { votingId },
      { fetchPolicy: 'network-only' }
    );
  }

  vote(
    input: Votes_Insert_Input[]
  ): Observable<
    FetchResult<VoteMutation, Record<string, any>, Record<string, any>>
  > {
    return this.voteGQL.mutate({ input }, { errorPolicy: 'all' });
  }
  markVoteAsInSection(
    id: number
  ): Observable<
    FetchResult<
      MarkVoteAsInSectionMutation,
      Record<string, any>,
      Record<string, any>
    >
  > {
    return this.markVoteAsInSectionGQL.mutate({ id });
  }

  //#region VOTINGS

  //#region REFERENDUMS

  createReferendum(
    referendumInput: Referendums_Insert_Input
  ): Observable<
    FetchResult<
      CreateReferendumMutation,
      Record<string, any>,
      Record<string, any>
    >
  > {
    return this.createReferendumGQL.mutate(
      { referendum: referendumInput },
      { errorPolicy: 'all' }
    );
  }
  updateReferendum(
    referendumId: number,
    set: Referendums_Set_Input,
    questions: Referendum_Questions_Insert_Input[],
    removed: number[]
  ): Observable<
    FetchResult<
      UpdateReferendumAndQuestionMutation,
      Record<string, any>,
      Record<string, any>
    >
  > {
    return this.updateReferendumAndQuestionGQL.mutate(
      {
        referendumId,
        set,
        questions,
        removed,
      },
      { errorPolicy: 'all' }
    );
  }

  getReferendums(
    limit = 10,
    offset = 0,
    condition: Referendums_Bool_Exp = {},
    orderBy: Referendums_Order_By
  ) {
    return this.getReferendumsGQL.watch(
      { limit, offset, condition, orderBy },
      {
        fetchPolicy: 'network-only',
        partialRefetch: true,
        errorPolicy: 'all',
        pollInterval: 5 * 1000,
      }
    );
  }

  getStartedReferendums(
    votingSectionSettlementId: number
  ): Observable<ApolloQueryResult<GetStartedReferendumsQuery>> {
    let where: Referendums_Bool_Exp;
    if (votingSectionSettlementId) {
      where = {
        _and: [
          { locked: { _eq: true } },
          { startedAt: { _is_null: false } },
          { finishedAt: { _is_null: true } },
          {
            _or: [
              // global or local
              { settlementId: { _is_null: true } },
              { settlementId: { _eq: votingSectionSettlementId } },
            ],
          },
        ],
      };
    } else {
      where = {
        _and: [
          // all
          { locked: { _eq: true } },
          { startedAt: { _is_null: false } },
          { finishedAt: { _is_null: true } },
        ],
      };
    }

    return this.getStartedReferendumsGQL.fetch(
      { where },
      { fetchPolicy: 'network-only' }
    );
  }
  addVoteForReferendum(
    answers: Referendum_Votes_Insert_Input[]
  ): Observable<
    FetchResult<
      AddVoteForTheReferendumMutation,
      Record<string, any>,
      Record<string, any>
    >
  > {
    // console.log(answers);
    return this.addVoteForTheReferendumGQL.mutate(
      { votes: answers },
      { errorPolicy: 'all' }
    );
  }

  //#region  REFERENDUMS

  // FOR DEMO PURPOSES
  getVotingCandidates(
    votingsId: number
  ): Observable<ApolloQueryResult<GetVotingCandidatesQuery>> {
    return this.getVotingCandidatesGQL.fetch({
      id: votingsId,
    });
  }
}
