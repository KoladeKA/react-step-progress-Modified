var React = require('react');
import LightenDarkenColor from '../../../src/util/changecolor';

var styles = {"progress-bar-wrapper":"_53Ji7","step-progress-bar":"_1Lo2h","progress-step":"_2Jtxm","step-index":"_2kL0S","step-icon":"_2JvrO","step-label":"_1hzhf","step-label-subtitle":"_1ixJ3","completed":"_2ZUAI","spring-down":"_3SDnc","current":"_35Ago","spring-up":"_JAh3L","has-error":"_1CcaK","shake":"_1ujce","step-content":"_2_g61","step-buttons":"_3uApM","step-action-btn":"_2pGos","action-btn-secondary":"_3CDiP","action-btn-primary":"_hsN1w","disabled":"_2RWmX"};

var StepStates;

(function (StepStates) {
  StepStates["NOT_STARTED"] = "not_started";
  StepStates["CURRENT"] = "current";
  StepStates["ERROR"] = "error";
  StepStates["COMPLETED"] = "completed";
})(StepStates || (StepStates = {}));

function stepsReducer(steps, action) {
  return steps.map(function (step, i) {
    if (i < action.payload.index) {
      step.state = StepStates.COMPLETED;
    } else if (i === action.payload.index) {
      step.state = action.payload.state;
    } else {
      step.state = StepStates.NOT_STARTED;
    }

    return step;
  });
}

function StepProgressBar(props) {

  var steps = props.steps,
      startingStep = props.startingStep,
      wrapperClass = props.wrapperClass,
      progressClass = props.progressClass,
      stepClass = props.stepClass,
      labelClass = props.labelClass,
      subtitleClass = props.subtitleClass,
      contentClass = props.contentClass,
      buttonWrapperClass = props.buttonWrapperClass,
      primaryBtnClass = props.primaryBtnClass,
      secondaryBtnClass = props.secondaryBtnClass,
      submitBtnName = props.submitBtnName,
      onSubmit = props.onSubmit,
      previousBtnName = props.previousBtnName,
      nextBtnName = props.nextBtnName;
      themeColor=props.themeColor;

  var _React$useReducer = React.useReducer(stepsReducer, steps),
      state = _React$useReducer[0],
      dispatch = _React$useReducer[1];

  var _React$useState = React.useState(startingStep),
      currentIndex = _React$useState[0],
      setCurrentIndex = _React$useState[1];

  React.useEffect(function () {
    dispatch({
      type: 'init',
      payload: {
        index: currentIndex,
        state: StepStates.CURRENT
      }
    });
  }, []);

  function submitHandler() {
    onSubmit();
  }

  function nextHandler() {
    if (currentIndex === steps.length - 1) {
      return;
    }

    var isStateValid = true;
    var stepValidator = state[currentIndex].validator;

    if (stepValidator) {
      isStateValid = stepValidator();
    }

    dispatch({
      type: 'next',
      payload: {
        index: isStateValid ? currentIndex + 1 : currentIndex,
        state: isStateValid ? StepStates.CURRENT : StepStates.ERROR
      }
    });

    if (isStateValid) {
      setCurrentIndex(currentIndex + 1);
    }
  }

  function prevHandler() {
    if (currentIndex === 0) {
      return;
    }

    dispatch({
      type: 'previous',
      payload: {
        index: currentIndex - 1,
        state: StepStates.CURRENT
      }
    });
    setCurrentIndex(currentIndex - 1);
  }
    
  const lightestColor = LightenDarkenColor(themeColor, 90)
  const darkColor = LightenDarkenColor(themeColor, -30)

  return (
    <div className={`${styles['progress-bar-wrapper']} ${wrapperClass || ''}`}>
      <ul className={`${styles['step-progress-bar']} ${progressClass || ''}`}>
        {state.map(function (step, i) {
          return (
            <li
              key={i}
              className={`${styles['progress-step']}${
                step.state === StepStates.COMPLETED ? ` ${styles.completed}` : ''
              }${step.state === StepStates.CURRENT ? ` ${styles.current}` : ''}${
                step.state === StepStates.ERROR ? ` ${styles['has-error']}` : ''
              } ${stepClass || ''}`}
            >
              {step.state === StepStates.COMPLETED && (
                <span className={styles['step-icon']}>
                  <svg
                    width="1.5rem"
                    viewBox="0 0 13 9"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M1 3.5L4.5 7.5L12 1" stroke="white" strokeWidth="1.5" />
                  </svg>
                </span>
              )}
              {step.state === StepStates.ERROR && <span className={styles['step-icon']}>!</span>}
              {step.state !== StepStates.COMPLETED && step.state !== StepStates.ERROR && (
                <span style={{backgroundColor: lightestColor}} className={styles['step-index']}>{i + 1}</span>
              )}
              <div className={`${styles['step-label']} ${labelClass || ''}`}>
                {step.label}
                {step.subtitle && (
                  <div className={`${styles['step-label-subtitle']} ${subtitleClass || ''}`}>
                    {step.subtitle}
                  </div>
                )}
              </div>
            </li>
          );
        })}
      </ul>

      <div className={`${styles['step-content']} ${contentClass || ''}`}>
        {props.steps[currentIndex].content}
      </div>

      <div className={`${styles['step-buttons']} ${buttonWrapperClass || ''}`}>
        <a
          style={{color: darkColor, borderColor: darkColor, border: '1px solid'}}
          className={`${styles['step-action-btn']} ${styles['action-btn-secondary']} ${
            currentIndex === 0 ? styles.disabled : ''
          } ${secondaryBtnClass || ''}`}
          onClick={prevHandler}
        >
          {previousBtnName ? previousBtnName : 'Previous'}
        </a>
        {currentIndex === state.length - 1 ? (
          <a
            style={{backgroundColor: darkColor, borderColor: darkColor, border: '1px solid'}}
            className={`${styles['step-action-btn']} ${styles['action-btn-primary']} ${
              primaryBtnClass || ''
            }`}
            onClick={submitHandler}
          >
            {submitBtnName || 'Submit'}
          </a>
        ) : (
          <a 
            style={{backgroundColor: darkColor, borderColor: darkColor, border: '1px solid'}}
            className={`${styles['step-action-btn']} ${styles['action-btn-primary']} ${
              primaryBtnClass || ''
            }`}
            onClick={nextHandler}
          >
            {nextBtnName ? nextBtnName : 'Next'}
          </a>
        )}
      </div>
    </div>
  );


}

module.exports = StepProgressBar;
//# sourceMappingURL=index.js.map
