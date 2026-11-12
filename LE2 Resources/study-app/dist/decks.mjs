import {quickReference as optimizationReference} from './optimization-reference.mjs';
import {practiceExams} from './practice-exams.mjs';
import {buildWalkthrough,buildLessons} from './walkthrough.mjs';
import {optimizationTutor} from './optimization-tutor.mjs';
import {regularizationTutor} from './decks/regularization-tutor.mjs';
import * as optimizationContent from './content.mjs';
import {examples as optimizationExamples} from './examples.mjs';
import {equationContext as optimizationEquations,notationBasics as optimizationNotation} from './equation-context.mjs';
import {minibatchAdvantages,challengeConnections,trainingScenario} from './training-connections.mjs';
import {conceptReferences} from './references.mjs?v=regularization-1';
import * as regularizationContent from './decks/regularization.mjs';
import * as regularizationPractice from './decks/regularization-practice.mjs';
import * as regularizationSupport from './decks/regularization-support.mjs';
import {detection} from './decks/detection.mjs';
import {segmentation} from './decks/segmentation.mjs';
export const decks={
 optimization:{id:'optimization',exam:practiceExams.optimization,tutor:optimizationTutor,number:'01',title:'Optimization',href:'./',...optimizationContent,examples:optimizationExamples,equationContext:optimizationEquations,notationBasics:optimizationNotation,minibatchAdvantages,challengeConnections,trainingScenario,references:conceptReferences,quickReference:optimizationReference,slideCount:44,assetPrefix:'assets/slide-',pdf:'assets/optimizer.pdf',storageKey:'ai222-optimization-v1'},
 regularization:{id:'regularization',exam:practiceExams.regularization,tutor:regularizationTutor,number:'02',title:'Regularization',href:'regularization.html',...regularizationContent,...regularizationPractice,resources:regularizationSupport.resources,notationBasics:regularizationSupport.notationBasics,challengeConnections:regularizationSupport.connections,trainingScenario:regularizationSupport.scenario,references:regularizationSupport.references,quickReference:regularizationSupport.quickReference,minibatchAdvantages:[],slideCount:46,assetPrefix:'assets/regularization/slide-',pdf:'assets/regularization/deck.pdf',storageKey:'ai222-regularization-v1'},
 detection,
 segmentation
};
for (const deck of Object.values(decks)) {
 deck.tutor.pages=buildWalkthrough(deck);
 deck.tutor.lessons=buildLessons(deck,deck.tutor.pages);
}
export function getDeck(pathname) {
 const entry = pathname.split('/').at(-1);
 return Object.values(decks).find(deck=>deck.href===entry) ?? decks.optimization;
}
