import { createModel } from "@rematch/core";
import { RootState } from "..";
import Course from "../../../datamodel/Course";

const DEFAULT_FILTER_STATE = {
  selectedCourse: null,
};

type Modify<T, R> = Omit<T, keyof R> & R;

type MyType = Modify<
  typeof DEFAULT_FILTER_STATE,
  {
    selectedCourse: Course | null;
  }
>;

const defaultStateWithType: MyType = DEFAULT_FILTER_STATE;

const courseCheckoutModel = createModel<RootState>()({
  effects: {}, // initial state
  reducers: {
    addCourse(state, course) {
      return { ...state, selectedCourse: course };
    },
  },
  state: defaultStateWithType,
});

export default courseCheckoutModel;
