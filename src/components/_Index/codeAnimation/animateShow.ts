import type { Signal } from "@builder.io/qwik";
import type { TypeWriter } from "~/components/_Index/codeAnimation/TypeWriter";
import animateHide from "~/components/_Index/codeAnimation/animateHide";
import { disappearEasingFunction } from "~/components/_Index/codeAnimation/easingFunctions";

const animateShow = (
  typeWriter: TypeWriter,
  codeDisplay: Signal<string>,
  timeStamp: number
): void => {
  if (typeWriter.appearStart === 0) {
    typeWriter.appearStart = timeStamp;
    typeWriter.previousTimeStamp = timeStamp;
  }

  if (
    typeWriter.currentChar >= typeWriter.totalChar &&
    typeWriter.timeAfterAnimationFinished >= typeWriter.disappearDelay
  ) {
    typeWriter.currentChar = typeWriter.totalChar - 1;
    typeWriter.appearStart = 0;
    typeWriter.previousTimeStamp = 0;
    typeWriter.timeAfterAnimationFinished = 0;
    typeWriter.timeAfterLastChar = 0;
    window.requestAnimationFrame(animateHide.bind(null, typeWriter, codeDisplay));
    return;
  }
  if (typeWriter.currentChar < typeWriter.totalChar) {
    if (timeStamp - typeWriter.previousTimeStamp < 100) {
      // if the tab is inactive, we will pause the animation
      typeWriter.timeAfterLastChar += timeStamp - typeWriter.previousTimeStamp;
      const ratio = disappearEasingFunction(
        Math.min(timeStamp - typeWriter.disappearStart, typeWriter.appearDurationUntilFullSpeed) /
          typeWriter.appearDurationUntilFullSpeed
      );
      const interval =
        typeWriter.largestIntervalBetweenCharDisappear * (1 - ratio) +
        typeWriter.smallestIntervalBetweenCharDisappear * ratio;
      if (typeWriter.timeAfterLastChar > interval) {
        if (typeWriter.displayCode[typeWriter.currentChar] === "\n") typeWriter.currentRow++;
        else typeWriter.revealedCharArr[typeWriter.currentRow]++;
        typeWriter.currentChar++;
        typeWriter.timeAfterLastChar -= interval;
      }
    }
  } else typeWriter.timeAfterAnimationFinished += timeStamp - typeWriter.previousTimeStamp;
  typeWriter.previousTimeStamp = timeStamp;
  window.requestAnimationFrame(animateShow.bind(null, typeWriter, codeDisplay));
};

export default animateShow;
