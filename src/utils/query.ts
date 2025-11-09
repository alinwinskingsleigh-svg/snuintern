// src/utils/query.ts

// 사용자님께서 제공해주신 유틸 함수를 사용합니다.
export const encodeQueryParams = ({
  params,
}: {
  params: Record<
    string,
    | string
    | number
    | boolean
    | string[]
    | number[]
    | boolean[]
    | null
    | undefined
  >;
}) => {
  const queryParameters = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value === undefined || value === null) return; // null, undefined 제외

    if (Array.isArray(value)) {
      // 배열인 경우, key를 반복하여 append 합니다. (예: key=v1&key=v2)
      value.forEach((v) => {
        // v.toString()을 사용하여 배열 요소가 문자열이 아닌 경우에도 처리
        queryParameters.append(key, v.toString());
      });
    } else {
      // 배열이 아닌 경우, value.toString()을 사용하여 boolean이나 number도 처리
      queryParameters.append(key, value.toString());
    }
  });

  return queryParameters.toString();
};
