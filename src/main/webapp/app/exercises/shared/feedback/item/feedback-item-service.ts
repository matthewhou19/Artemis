import { Injectable } from '@angular/core';
import { Feedback } from 'app/entities/feedback.model';
import { TranslateService } from '@ngx-translate/core';
import { FeedbackItem } from 'app/exercises/shared/feedback/item/feedback-item';
import { Exercise } from 'app/entities/exercise.model';
import { FeedbackNode } from 'app/exercises/shared/feedback/node/feedback-node';
import { getAllFeedbackGroups } from 'app/exercises/shared/feedback/group/feedback-groups';
import { FeedbackGroup } from 'app/exercises/shared/feedback/group/feedback-group';

export interface FeedbackItemService {
    /**
     * Creates a feedback item with a name, title and text for each feedback object.
     * @param feedbacks The list of feedback objects.
     * @param showTestDetails
     */
    create(feedbacks: Feedback[], showTestDetails: boolean): FeedbackItem[];

    /**
     * Uses {@link FeedbackGroup} predicate shouldContain and adds all that fulfill this predicate to its group
     * @param feedbackItems to be added to groups
     * @param exercise containing information needed to configure the {@link FeedbackGroup}
     */
    group(feedbackItems: FeedbackItem[], exercise: Exercise): FeedbackNode[];
}

@Injectable({ providedIn: 'root' })
export class FeedbackItemServiceImpl implements FeedbackItemService {
    constructor(private translateService: TranslateService) {}

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    create(feedbacks: Feedback[], showTestDetails: boolean): FeedbackItem[] {
        return feedbacks.map((feedback) => ({
            type: 'Feedback',
            name: this.translateService.instant('artemisApp.result.detail.feedback'),
            title: feedback.text,
            text: feedback.detailText,
            positive: feedback.positive,
            credits: feedback.credits,
        }));
    }

    group(feedbackItems: FeedbackItem[]): FeedbackNode[] {
        return getAllFeedbackGroups() //
            .map((group: FeedbackGroup) => group.addAllItems(feedbackItems.filter(group.shouldContain)))
            .filter((group: FeedbackGroup) => !group.isEmpty());
    }
}