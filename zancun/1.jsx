case TASK_TYPE.JoinVip:
            try {
              const { openUrl } = yield call(doTask, {
                taskId,
                taskToken,
                actionType,
                taskType,
              })

              yield call(function () {
                return new Promise((resolve, reject) => {
                  toPage(openUrl, {
                    onBack: () => {
                      status == 2 || status == 4 ? reject() : resolve()
                    }
                  })
                })
              })

              const { result } = yield call(doTask, {
                taskId,
                taskToken,
                actionType,
                taskType,
              })
            } catch {

            }
            break;