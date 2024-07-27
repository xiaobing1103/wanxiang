/**
 * 生成一个用不重复的ID
 */
export /**
 * 生成一个用不重复的ID
 */
	function GenNonDuplicateID(n: number) {
	return Math.random().toString(36).substr(2, n) + Date.now().toString(36).substr(4, n);
}
//GenNonDuplicateID()将生成 rfmipbs8ag0kgkcogc 类似的ID